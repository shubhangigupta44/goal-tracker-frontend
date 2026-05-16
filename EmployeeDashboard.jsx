import React, { useEffect } from 'react';
import useGoalStore from '../store/useGoalStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from 'lucide-react'; // Wait, let's just make a simple badge using span

export default function EmployeeDashboard() {
  const { goals, fetchGoals, isLoading, submitGoals, error } = useGoalStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const totalWeightage = goals.reduce((acc, goal) => acc + goal.weightage, 0);
  const canSubmit = totalWeightage === 100 && goals.some(g => g.status === 'Draft' || g.status === 'Rejected');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800'; // Draft
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
          <p className="text-muted-foreground mt-1">Manage and track your quarterly goals.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Total Weightage</span>
            <span className={`text-xl font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWeightage}% / 100%
            </span>
          </div>
          <Button variant="outline" onClick={() => {/* Open Modal to Create Goal */}}>Create Goal</Button>
          <Button disabled={!canSubmit || isLoading} onClick={() => submitGoals()}>
            Submit for Approval
          </Button>
        </div>
      </div>
      
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
           <p>Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-10 text-center text-muted-foreground border rounded-lg border-dashed">
            No goals found. Start by creating a new goal.
          </div>
        ) : (
          goals.map(goal => (
            <Card key={goal._id} className="relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${goal.status === 'Approved' ? 'bg-green-500' : goal.status === 'Rejected' ? 'bg-red-500' : goal.status === 'Submitted' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Thrust Area</span>
                  <span className="font-medium">{goal.thrustArea}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Target ({goal.uomType})</span>
                  <span className="font-medium">{goal.target}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Weightage</span>
                  <span className="font-medium">{goal.weightage}%</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
