import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
    }
  };

  return (
    <Mutation mutation={SIGNUP_MUTATION} variables={{ email, name, password }}>
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await signup();
            setName('');
            setEmail('');
            setPassword('');
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2>Sign Up for an Account</h2>
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
            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                placeholder="name"
                value={name}
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
            <button type="submit">Sign up</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signup;
