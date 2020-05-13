import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
    }
  };

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{ email, password }}
      refetchQueries={[{ CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await signin();
            setEmail('');
            setPassword('');
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign In for an Account</h2>
            <Error error={error} />
            <label htmlFor="email">
              Email
              <input
                type="text"
                name="email"
                placeholder="email"
                value={email}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Sign in!</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signin;
