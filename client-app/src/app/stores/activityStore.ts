import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            // We can using runInAction()
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activities.push(activity);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(x => x.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.setEditMode(true);
    }

    setEditMode = (state: boolean) => {
        this.editMode = state;
    }

    closeForm = () => {
        this.setEditMode(false);
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activities = [...this.activities, activity];
                this.selectedActivity = activity;
                this.setEditMode(false);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            this.setEditMode(false);
            this.loading = false;
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];
                this.selectedActivity = activity;
                this.setEditMode(false);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setEditMode(false);
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities = [...this.activities.filter(x => x.id !== id)];
                this.loading = false;
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
            })
        }
    }
}