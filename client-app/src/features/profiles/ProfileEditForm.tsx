import React from 'react';
import { Button } from 'semantic-ui-react';
import { Formik, Form } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';
import { useStore } from '../../app/stores/store';
import { Profile } from '../../app/models/profile';
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';

interface Props {
    editMode: (mode: boolean) => void;
}

export default observer(function ProfileEditForm({ editMode }: Props) {
    const { profileStore: { profile, updateProfile, loading } } = useStore();

    function handleFormSubmit(profile: Partial<Profile>) {
        updateProfile(profile).then(() => editMode(false));
    }

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        bio: Yup.string().required()
    })

    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
            onSubmit={values => handleFormSubmit(values)} >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                <Form className='ui form'>
                    <MyTextInput name='displayName' placeholder='DisplayName' />
                    <MyTextArea name='bio' placeholder='Add your bio' rows={3} />
                    <Button
                        disabled={isSubmitting || !isValid || !dirty || loading}
                        floated='right'
                        positive
                        type='submit'
                        content='Update profile' />
                </Form>
            )}
        </Formik >
    )
})