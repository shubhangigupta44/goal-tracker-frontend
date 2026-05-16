import React, { useEffect, useState } from 'react';
import useGoalStore from '../store/useGoalStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function ManagerDashboard() {
  const { goals, fetchGoals, isLoading, approveGoal, error } = useGoalStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleApprove = async (id) => {
    await approveGoal(id, { status: 'Approved' });
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      await approveGoal(id, { status: 'Rejected', rejectionReason: reason });
    }
  };

  // Group by employee
  const employeeGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.employeeId._id]) {
      acc[goal.employeeId._id] = {
        employee: goal.employeeId,
        goals: []
      };
    }
    acc[goal.employeeId._id].goals.push(goal);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Goals</h1>
        <p className="text-muted-foreground mt-1">Review and approve your team's goals.</p>
      </div>

      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      <div className="flex flex-col gap-8">
        {isLoading ? <p>Loading team goals...</p> : Object.values(employeeGoals).length === 0 ? (
           <p className="text-muted-foreground">No team goals found.</p>
        ) : (
          Object.values(employeeGoals).map(({ employee, goals }) => (
            <div key={employee._id} className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">{employee.name} <span className="text-sm font-normal text-muted-foreground">({employee.email})</span></h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map(goal => (
                  <Card key={goal._id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${goal.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {goal.status}
                        </span>
                      </div>
                      <CardDescription>{goal.thrustArea}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{goal.description}</p>
                      <div className="flex justify-between items-center text-sm font-medium mb-1">
                        <span>Target: {goal.target}</span>
                        <span>{goal.weightage}%</span>
                      </div>
                      
                      {goal.status === 'Submitted' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleApprove(goal._id)}>Approve</Button>
                          <Button size="sm" variant="destructive" className="w-full" onClick={() => handleReject(goal._id)}>Reject</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
