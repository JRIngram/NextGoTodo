import type { Meta, StoryObj } from "@storybook/react";
import { TodoList } from "../components/TodoList";
import {
  completedTask,
  uncompletedTask,
} from "../components/TaskCard/__fixtures__/task-card-fixtures";

const meta: Meta<typeof TodoList> = {
  title: "TodoList",
  tags: ["autodocs"],
  component: TodoList,
  parameters: {
    mockData: [
      {
        url: "http://127.0.0.1:8080/todo",
        method: "GET",
        status: 200,
        response: {
          a: { test: true },
          json: {todoList: []},
        },
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof TodoList>;

const TodoListWithCompleted = () => <TodoList includeCompleted={true} />;

export const FetchCall = TodoListWithCompleted.bind({});
