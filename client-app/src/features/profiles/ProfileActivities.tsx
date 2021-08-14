import React, { SyntheticEvent } from 'react';
import { Grid, Header, Tab, Card, Image, TabProps } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default observer(function ProfleActivities() {
    const { profileStore: {
        profile,
        loadingActivities,
        loadUserActivities,
        UserActivities } } = useStore();

    const panes = [
        { menuItem: 'Future Events', pane: { key: 'future' } },
        { menuItem: 'Past Events', pane: { key: 'past' } },
        { menuItem: 'Hosting', pane: { key: 'hosting' } }
    ]

    useEffect(() => {
        loadUserActivities(profile!.userName);
    }, [loadUserActivities, profile])

    function handleTabChange(e: SyntheticEvent, data: TabProps) {
        loadUserActivities(profile!.userName,
            panes[data.activeIndex as number].pane.key)
    };

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {UserActivities?.map(userActivity => (
                            <Card
                                as={Link}
                                to={`/activities/${userActivity.id}`}
                                key={userActivity.id}
                            >
                                <Image
                                    src={`/assets/categoryImages/${userActivity.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover' }}
                                />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{userActivity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(userActivity.date), 'do LLL')}</div>
                                        <div>{format(new Date(userActivity.date), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})