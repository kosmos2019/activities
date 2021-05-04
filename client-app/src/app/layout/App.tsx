import React, { useEffect, useState } from 'react';
import { Container, StrictGridColumnProps } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, SetEditMode] = useState(false);
  const [loading, SetLoading] = useState(true);
  const [submitting, SetSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      });
      SetActivities(activities);
      SetLoading(false);
    })
  }, []);

  function handleSelectActivity(id: string) {
    SetSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    SetSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    SetEditMode(true);
  }

  function handleFormClose() {
    SetEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    SetSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        SetActivities([...activities.filter(x => x.id !== activity.id), activity]);
        SetSelectedActivity(activity);
        SetEditMode(false);
        SetSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        SetActivities([...activities, activity]);
        SetSelectedActivity(activity);
        SetEditMode(false);
        SetSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string) {
    SetSubmitting(true);
    agent.Activities.delete(id).then(() => {
      SetActivities([...activities.filter(x => x.id !== id)]);
      SetSubmitting(false);
    })
  }

  if (loading) { return (<LoadingComponent content='Loading app...' />) }

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
