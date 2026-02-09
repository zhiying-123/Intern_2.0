"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { activateWallet, depositMoney } from "./portfolio";

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

export default function PortfolioUI({ data }: { data: PortfolioData }) {
    const { wallet, holdings, totalValue, totalCost, totalProfitLoss, totalProfitLossPercent } = data;
    const router = useRouter();
    const [isActivating, setIsActivating] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('10000');

    const totalPortfolioValue = (wallet?.balance || 0) + totalValue;

    const handleActivateWallet = async () => {
        setIsActivating(true);
        try {
            const result = await activateWallet();
            console.log('Activate result:', result);

            if (result.success) {
                alert(`✅ ${result.message || 'Wallet activated successfully!'}`);
                router.refresh();
            } else if (result.alreadyExists) {
                alert(`ℹ️ ${result.message || 'Wallet already activated'}`);
            } else {
                alert(`❌ ${result.error || 'Failed to activate wallet'}`);
            }
        } catch (error) {
            console.error('Error activating wallet:', error);
            alert('❌ Failed to activate wallet. Please try again.');
        } finally {
            setIsActivating(false);
        }
    };

    const handleDeposit = async () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsDepositing(true);
        try {
            const result = await depositMoney(amount);

            if (result.success) {
                alert(`✅ ${result.message}`);
                setShowDepositModal(false);
                setDepositAmount('10000');
                router.refresh();
            } else {
                alert(`❌ ${result.error || 'Failed to deposit'}`);
            }
        } catch (error) {
            console.error('Error depositing:', error);
            alert('❌ Failed to deposit');
        } finally {
            setIsDepositing(false);
        }
    };

    return (
        <div className="py-4 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <span>💼</span>
                            <span>My Portfolio</span>
                        </h1>
                        <p className="text-gray-600">
                            Your investment portfolio • Updated in real-time
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!wallet && (
                            <button
                                onClick={handleActivateWallet}
                                disabled={isActivating}
                                className="px-6 py-3 bg-linear-to-br from-green-100 to-emerald-100 text-green-800 font-bold rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isActivating ? '⏳ Activating...' : '🎁 Activate Wallet (Free RM 100,000)'}
                            </button>
                        )}
                        {wallet && (
                            <button
                                onClick={() => setShowDepositModal(true)}
                                className="px-6 py-3 bg-linear-to-br from-blue-100 to-cyan-100 text-blue-800 font-bold rounded-xl hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-blue-300"
                            >
                                💰 Deposit Money
                            </button>
                        )}
                    </div>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Portfolio Value */}
                    <div className="bg-linear-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl shadow-lg p-6">
                        <div className="text-sm font-semibold text-gray-600 mb-2">💰 Total Portfolio</div>
                        <div className="text-3xl font-bold text-gray-900">
                            RM {totalPortfolioValue.toFixed(2)}
                        </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-6">
                        <div className="text-sm font-semibold text-gray-600 mb-2">🏦 Cash Balance</div>
                        <div className="text-3xl font-bold text-amber-700">
                            RM {wallet?.balance.toFixed(2) || '0.00'}
                        </div>
                    </div>

                    {/* Holdings Value */}
                    <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-6">
                        <div className="text-sm font-semibold text-gray-600 mb-2">📊 Holdings Value</div>
                        <div className="text-3xl font-bold text-gray-900">
                            RM {totalValue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Cost: RM {totalCost.toFixed(2)}
                        </div>
                    </div>

                    {/* Total Profit/Loss */}
                    <div className={`border border-amber-200 rounded-2xl shadow-lg p-6 ${totalProfitLoss >= 0 ? 'bg-linear-to-br from-green-50 to-emerald-50' : 'bg-linear-to-br from-red-50 to-rose-50'
                        }`}>
                        <div className="text-sm font-semibold text-gray-600 mb-2">
                            {totalProfitLoss >= 0 ? '📈' : '📉'} Total P&L
                        </div>
                        <div className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {totalProfitLoss >= 0 ? '+' : ''}RM {totalProfitLoss.toFixed(2)}
                        </div>
                        <div className={`text-sm font-semibold mt-1 ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                        </div>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span>📋</span>
                            <span>My Holdings</span>
                            <span className="text-lg text-gray-500">({holdings.length})</span>
                        </h2>
                        <Link href="/staff_dashboard/stocks">
                            <button className="px-4 py-2 bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-lg hover:from-amber-200 hover:to-yellow-200 transition-all duration-200 shadow hover:shadow-md border border-amber-200">
                                🔍 Browse Stocks
                            </button>
                        </Link>
                    </div>

                    {holdings.length === 0 ? (
                        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Holdings Yet</h3>
                            <p className="text-gray-600 mb-4">Start building your portfolio by buying stocks</p>
                            <Link href="/staff_dashboard/stocks">
                                <button className="px-6 py-3 bg-linear-to-br from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-lg hover:from-amber-200 hover:to-yellow-200 transition-all duration-200 shadow hover:shadow-md border border-amber-200">
                                    Browse Stocks
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white border border-amber-200 rounded-2xl shadow-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-linear-to-r from-amber-50 to-yellow-50 border-b border-amber-200 px-6 py-4">
                                <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-700">
                                    <div className="col-span-2">Symbol</div>
                                    <div className="col-span-1 text-right">Qty</div>
                                    <div className="col-span-2 text-right">Avg Price</div>
                                    <div className="col-span-2 text-right">Current</div>
                                    <div className="col-span-2 text-right">Total Value</div>
                                    <div className="col-span-2 text-right">P&L</div>
                                    <div className="col-span-1 text-right">Action</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-amber-200">
                                {holdings.map((holding) => {
                                    const isProfit = holding.profit_loss >= 0;
                                    const isPriceUp = holding.change >= 0;

                                    return (
                                        <div key={holding.holding_id}
                                            className="px-6 py-4 hover:bg-amber-50 transition-colors">
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                {/* Symbol */}
                                                <div className="col-span-2">
                                                    <div className="font-bold text-gray-900 text-lg">
                                                        {holding.symbol}
                                                    </div>
                                                    <div className={`text-xs font-semibold ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isPriceUp ? '▲' : '▼'} {Math.abs(holding.change_percent).toFixed(2)}%
                                                    </div>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-1 text-right">
                                                    <div className="text-base font-semibold text-gray-900">
                                                        {holding.quantity}
                                                    </div>
                                                </div>

                                                {/* Average Price */}
                                                <div className="col-span-2 text-right">
                                                    <div className="text-base text-gray-700">
                                                        ${holding.avg_price.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Current Price */}
                                                <div className="col-span-2 text-right">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        ${holding.current_price.toFixed(2)}
                                                    </div>
                                                    <div className={`text-xs font-semibold ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isPriceUp ? '+' : ''}${holding.change.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Total Value */}
                                                <div className="col-span-2 text-right">
                                                    <div className="text-base font-bold text-gray-900">
                                                        RM {holding.total_value.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Cost: RM {holding.total_cost.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Profit/Loss */}
                                                <div className="col-span-2 text-right">
                                                    <div className={`inline-flex flex-col items-end px-3 py-2 rounded-lg ${isProfit ? 'bg-green-50' : 'bg-red-50'
                                                        }`}>
                                                        <div className={`text-base font-bold ${isProfit ? 'text-green-700' : 'text-red-700'
                                                            }`}>
                                                            {isProfit ? '+' : ''}RM {holding.profit_loss.toFixed(2)}
                                                        </div>
                                                        <div className={`text-xs font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {isProfit ? '+' : ''}{holding.profit_loss_percent.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <div className="col-span-1 text-right">
                                                    <Link href={`/staff_dashboard/stocks/${holding.symbol}`}>
                                                        <button className="text-amber-700 hover:text-amber-900 font-semibold text-sm">
                                                            View →
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Notice */}
                <div className="text-center text-sm text-gray-500">
                    <p>⏰ Portfolio values update in real-time based on current market prices</p>
                </div>

                {/* Deposit Modal */}
                {showDepositModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50" onClick={() => setShowDepositModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-amber-200" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>💰</span>
                                <span>Deposit Money</span>
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Add funds to your wallet (simulated for demo purposes)
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount (RM)
                                </label>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    min="1"
                                    step="1000"
                                    className="w-full px-4 py-3 text-2xl font-bold rounded-lg border-2 border-amber-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                    placeholder="10000"
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button onClick={() => setDepositAmount('5000')} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold border border-amber-200">
                                        RM 5,000
                                    </button>
                                    <button onClick={() => setDepositAmount('10000')} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold border border-amber-200">
                                        RM 10,000
                                    </button>
                                    <button onClick={() => setDepositAmount('50000')} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold border border-amber-200">
                                        RM 50,000
                                    </button>
                                    <button onClick={() => setDepositAmount('100000')} className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold border border-amber-200">
                                        RM 100,000
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDepositModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeposit}
                                    disabled={isDepositing}
                                    className="flex-1 px-4 py-3 bg-linear-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-800 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDepositing ? '⏳ Processing...' : '✅ Deposit'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
