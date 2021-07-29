import { Formik, Form } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Button } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup';

export interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChatBis({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }

        return (() => {
            commentStore.clearComments();
        })
    }, [commentStore, activityId]);

    const validationSchema = Yup.object({
        body: Yup.string().required(),
    })

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{comment.createdAt}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{ body: '' }}
                        onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}>
                        {({ isSubmitting, isValid }) => (
                            <Form className='ui form'>
                                <MyTextArea name='body' placeholder='Add comment' rows={2} />
                                <Button
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !isValid}
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    type='submit'
                                    floated='right'
                                />
                            </Form>
                        )}
                    </Formik>
                </Comment.Group>
            </Segment>
        </>

    )
})
