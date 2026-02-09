// Server: fetch portfolio data (wallet + holdings + current prices)
'use server';

import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface StockQuote {
    c: number;  // Current price
    d: number;  // Change
    dp: number; // Percent change
}

interface HoldingWithPrice {
    holding_id: number;
    symbol: string;
    quantity: number;
    avg_price: number;
    current_price: number;
    change: number;
    change_percent: number;
    total_value: number;
    total_cost: number;
    profit_loss: number;
    profit_loss_percent: number;
}

interface PortfolioData {
    wallet: {
        balance: number;
        currency: string;
    } | null;
    holdings: HoldingWithPrice[];
    totalValue: number;
    totalCost: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
}

async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
    const key = process.env.FINNHUB_API_KEY;
    if (!key) {
        console.warn("Missing FINNHUB_API_KEY in environment");
        return null;
    }

    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;
        const res = await fetch(url, { next: { revalidate: 60 } });

        if (!res.ok) {
            console.error(`Failed to fetch quote for ${symbol}: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
}

export async function getPortfolioData(): Promise<PortfolioData> {
    // Get user ID from session
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');

    if (!userCookie) {
        return {
            wallet: null,
            holdings: [],
            totalValue: 0,
            totalCost: 0,
            totalProfitLoss: 0,
            totalProfitLossPercent: 0
        };
    }

    const userData = JSON.parse(userCookie.value);
    const userId = userData.id;

    try {
        // Fetch wallet (don't auto-create, let user activate manually)
        const wallet = await prisma.userWallet.findUnique({
            where: { u_id: userId }
        });

        if (wallet) {
            console.log('Existing wallet found:', wallet);
        } else {
            console.log(`No wallet found for user ${userId}, user needs to activate`);
        }

        // Fetch holdings
        const holdings = await prisma.stockHolding.findMany({
            where: { u_id: userId },
            orderBy: { symbol: 'asc' }
        });

        // Fetch current prices for all holdings
        const holdingsWithPrices: HoldingWithPrice[] = await Promise.all(
            holdings.map(async (holding) => {
                const quote = await fetchStockQuote(holding.symbol);
                const currentPrice = quote?.c || holding.avg_price;
                const totalValue = currentPrice * holding.quantity;
                const totalCost = holding.avg_price * holding.quantity;
                const profitLoss = totalValue - totalCost;
                const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

                return {
                    holding_id: holding.holding_id,
                    symbol: holding.symbol,
                    quantity: holding.quantity,
                    avg_price: holding.avg_price,
                    current_price: currentPrice,
                    change: quote?.d || 0,
                    change_percent: quote?.dp || 0,
                    total_value: totalValue,
                    total_cost: totalCost,
                    profit_loss: profitLoss,
                    profit_loss_percent: profitLossPercent
                };
            })
        );

        // Calculate totals
        const totalValue = holdingsWithPrices.reduce((sum, h) => sum + h.total_value, 0);
        const totalCost = holdingsWithPrices.reduce((sum, h) => sum + h.total_cost, 0);
        const totalProfitLoss = totalValue - totalCost;
        const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

        return {
            wallet: wallet ? {
                balance: wallet.balance,
                currency: wallet.currency
            } : null,
            holdings: holdingsWithPrices,
            totalValue,
            totalCost,
            totalProfitLoss,
            totalProfitLossPercent
        };
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        return {
            wallet: null,
            holdings: [],
            totalValue: 0,
            totalCost: 0,
            totalProfitLoss: 0,
            totalProfitLossPercent: 0
        };
    }
}

// Server action: Activate wallet
export async function activateWallet() {
    'use server';

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');

    if (!userCookie) {
        return { success: false, error: 'User not logged in' };
    }

    const userData = JSON.parse(userCookie.value);
    const userId = userData.id;

    if (!userId) {
        return { success: false, error: 'User ID not found' };
    }

    try {
        // Check if wallet already exists
        const existingWallet = await prisma.userWallet.findUnique({
            where: { u_id: userId }
        });

        if (existingWallet) {
            return {
                success: false,
                message: 'Wallet already activated',
                alreadyExists: true
            };
        }

        // Create new wallet with initial balance of 100,000 MYR
        const newWallet = await prisma.userWallet.create({
            data: {
                u_id: userId,
                balance: 100000.00,
                currency: 'MYR'
            }
        });

        console.log('Wallet activated for user:', userId, newWallet);

        revalidatePath('/staff_dashboard/stocks/portfolio');

        return {
            success: true,
            message: '🎉 Wallet activated! You received RM 100,000 free virtual money!',
            wallet: newWallet
        };
    } catch (error) {
        console.error('Error activating wallet:', error);
        return { success: false, error: 'Failed to activate wallet' };
    }
}

// Server action: Deposit money
export async function depositMoney(amount: number) {
    'use server';

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');

    if (!userCookie) {
        return { success: false, error: 'User not logged in' };
    }

    const userData = JSON.parse(userCookie.value);
    const userId = userData.id;

    if (!userId) {
        return { success: false, error: 'User ID not found' };
    }

    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: 'Invalid amount' };
    }

    try {
        // Check if wallet exists
        const wallet = await prisma.userWallet.findUnique({
            where: { u_id: userId }
        });

        if (!wallet) {
            return { success: false, error: 'Wallet not activated. Please activate wallet first.' };
        }

        // Update wallet balance
        const updatedWallet = await prisma.userWallet.update({
            where: { u_id: userId },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        console.log('Deposit successful:', userId, amount, updatedWallet.balance);

        revalidatePath('/staff_dashboard/stocks/portfolio');

        return {
            success: true,
            message: `✅ Successfully deposited RM ${amount.toFixed(2)}!`,
            newBalance: updatedWallet.balance
        };
    } catch (error) {
        console.error('Error depositing money:', error);
        return { success: false, error: 'Failed to deposit money' };
    }
}
