import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

export default function ProfileAbout() {
    const [editMode, setEditMode] = useState(false);
    const { profileStore: { isCurrentUser } } = useStore();

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content='About Bob' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)} />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {isCurrentUser && editMode && (
                        <ProfileEditForm editMode={setEditMode} />
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}