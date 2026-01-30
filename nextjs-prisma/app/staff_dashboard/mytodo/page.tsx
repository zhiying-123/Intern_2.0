import TodoUI from "./todoUI";
import { getUserTodos } from "./todo";

export default async function MyTodoPage() {
    const todos = await getUserTodos();

    return <TodoUI todos={todos} />;
}
