import { gql } from "@apollo/client";

// ============ BOOK QUERIES ============
export const GET_BOOKS = gql`
  query GetBooks($genre: String, $status: String) {
    books(genre: $genre, status: $status) {
      id
      title
      author
      genre
      price
      rent_price
      status
      owner_id
      description
      coverImage
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
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

export const GET_GENRES = gql`
  query GetGenres {
    genres
  }
`;

// ============ USER QUERIES ============
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

// ============ CART QUERIES ============
export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      user_id
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

// ============ ORDER QUERIES ============
export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      totalAmount
      status
      orderType
      items {
        id
        quantity
        price
        book {
          id
          title
          author
          coverImage
        }
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    allOrders {
      id
      user_id
      totalAmount
      status
      orderType
      user {
        id
        name
        email
      }
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

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      totalAmount
      status
      orderType
      items {
        id
        quantity
        price
        book {
          id
          title
          author
          coverImage
        }
      }
    }
  }
`;

// ============ RENTAL QUERIES ============
export const GET_MY_RENTALS = gql`
  query GetMyRentals {
    myRentals {
      id
      startDate
      dueDate
      returnDate
      status
      rentalPrice
      book {
        id
        title
        author
        coverImage
      }
    }
  }
`;

export const GET_ALL_RENTALS = gql`
  query GetAllRentals {
    allRentals {
      id
      user_id
      startDate
      dueDate
      returnDate
      status
      rentalPrice
      user {
        id
        name
        email
      }
      book {
        id
        title
        author
      }
    }
  }
`;

// ============ STATS ============
export const GET_STATS = gql`
  query GetStats {
    stats {
      totalUsers
      totalBooks
      totalGenres
      totalOrders
      totalRentals
      activeRentals
    }
  }
`;
