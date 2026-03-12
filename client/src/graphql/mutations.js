import { gql } from "@apollo/client";

// ============ AUTH MUTATIONS ============
export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

// ============ BOOK MUTATIONS ============
export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $genre: String!
    $price: Float
    $rent_price: Float
    $description: String
    $coverImage: String
  ) {
    addBook(
      title: $title
      author: $author
      genre: $genre
      price: $price
      rent_price: $rent_price
      description: $description
      coverImage: $coverImage
    ) {
      id
      title
      author
      genre
      price
      rent_price
      description
      coverImage
      status
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $author: String
    $genre: String
    $price: Float
    $rent_price: Float
    $status: String
    $description: String
    $coverImage: String
  ) {
    updateBook(
      id: $id
      title: $title
      author: $author
      genre: $genre
      price: $price
      rent_price: $rent_price
      status: $status
      description: $description
      coverImage: $coverImage
    ) {
      id
      title
      author
      genre
      price
      rent_price
      status
      description
      coverImage
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

// ============ CART MUTATIONS ============
export const ADD_TO_CART = gql`
  mutation AddToCart($bookId: ID!, $mode: String!) {
    addToCart(bookId: $bookId, mode: $mode) {
      id
      book_id
      quantity
      mode
      book {
        id
        title
        author
        price
        rent_price
        coverImage
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($id: ID!, $quantity: Int!) {
    updateCartItem(id: $id, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

// ============ ORDER MUTATIONS ============
export const PLACE_ORDER = gql`
  mutation PlaceOrder {
    placeOrder {
      id
      totalAmount
      status
      orderType
      createdAt
      items {
        id
        quantity
        price
        book {
          id
          title
          author
        }
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// ============ RENTAL MUTATIONS ============
export const RENT_BOOK = gql`
  mutation RentBook($bookId: ID!, $days: Int!) {
    rentBook(bookId: $bookId, days: $days) {
      id
      startDate
      dueDate
      status
      rentalPrice
      book {
        id
        title
        author
      }
    }
  }
`;

export const RETURN_RENTAL = gql`
  mutation ReturnRental($id: ID!) {
    returnRental(id: $id) {
      id
      returnDate
      status
    }
  }
`;

// ============ USER MANAGEMENT MUTATIONS ============
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
