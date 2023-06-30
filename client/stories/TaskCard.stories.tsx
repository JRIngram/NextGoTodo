import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from '../components/TaskCard/TaskCard';
import { completedTask, uncompletedTask } from '../components/TaskCard/__fixtures__/task-card-fixtures';

const meta: Meta<typeof TaskCard> = {
  title: 'TaskCard',
  tags: ['autodocs'],
  component: TaskCard,
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

const mockOnChangeTaskStatus = async () => {
  console.log('triggered');
};

export const CompletedTaskCard: Story = {
  render: () => <TaskCard task={completedTask} onChangeTaskStatus={mockOnChangeTaskStatus} />,
}

export const UncompletedTaskCard: Story = {
  render: () => <TaskCard task={uncompletedTask} onChangeTaskStatus={mockOnChangeTaskStatus}/>,
}