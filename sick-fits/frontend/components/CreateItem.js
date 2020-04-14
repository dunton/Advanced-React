import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = (props) => {
  const [{ title, description, image, price, largeImage }, setState] = useState(
    {
      title: '',
      description: '',
      image: '',
      largeImage: '',
      price: 0,
    }
  );

  const state = { title, description, image, largeImage, price };

  const handleChange = (e) => {
    const { type, name, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const uploadFile = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dmhjnslt0/image/upload/',
      {
        method: 'POST',
        body: data,
      }
    );

    const file = await res.json();
    setState((prevState) => ({
      ...prevState,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    }));
  };

  console.log(state);
  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            });
          }}
        >
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="image"
                placeholder="Upload an image"
                required
                onChange={uploadFile}
              />
              {image && <img src={image} alt="upload preview" />}
            </label>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={title}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                required
                value={price}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="description">
              Description
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="Enter a description"
                required
                value={description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
