import { observer } from 'mobx-react-lite';
import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function RegisterForm() {
    const { userStore } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        userName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required()
    });

    return (
        <Formik
            initialValues={{ displayName: '', userName: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error =>
                setErrors({ error }))}
            validationSchema={validationSchema}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='userName' placeholder='Username' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage
                        name='error' render={() =>
                            <ValidationErrors errors={errors.error} />}
                    />
                    <Button
                        disabled={isSubmitting || !isValid || !dirty}
                        loading={isSubmitting} positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})