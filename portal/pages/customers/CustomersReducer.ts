import { customersConstants } from "./CustomersActions";
import { ICustomer, ICountry } from "models/.";
import { PAGE_SIZE } from "constants/constants";

export interface ICustomersState {
  customerItems: ICustomer[];
  contacts: any;
  countries: ICountry[];
  contactTypes: ICountry[];
  selectedContactIds: number[];
  isLoading: boolean;
  isLoaded: boolean;
  noMoreData: boolean;
}

const initialState: ICustomersState = {
  customerItems: [],
  contacts: [],
  countries: [],
  contactTypes: [],
  selectedContactIds: [],
  isLoading: false,
  isLoaded: false,
  noMoreData: false
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case customersConstants.REQUEST_PUSHED: {
      return { ...state, isLoading: true };
    }
    case customersConstants.REQUEST_FAILURE: {
      return { ...state, isLoading: false, isLoaded: false };
    }
    case customersConstants.ADD_CONTACT_SUCCESS: {
      return {
        ...state,
        contacts: state.contacts.concat(action.payload),
        isLoading: false,
        isLoaded: true
      };
    }
    case customersConstants.ADD_CUSTOMER_SUCCESS: {
      return {
        ...state,
        customerItems: state.customerItems.concat(action.payload),
        isLoading: false,
        isLoaded: true
      };
    }
    case customersConstants.UPDATE_COLOR: {
      return {
        ...state,
        customerItems: state.customerItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        isLoading: false,
        isLoaded: true
      };
    }
    case customersConstants.GET_CONTACT_TYPES_SUCCESS: {
      return { ...state, contactTypes: action.payload, isLoading: false, isLoaded: true };
    }
    case customersConstants.GET_COUNTRIES_SUCCESS: {
      return { ...state, countries: action.payload, isLoading: false, isLoaded: true };
    }
    case customersConstants.GET_CONTACTS_SUCCESS: {
      return { ...state, contacts: action.payload, isLoading: false, isLoaded: true };
    }
    case customersConstants.GET_CUSTOMERS_SUCCESS: {
      const { customerItems } = state;
      const { payload, append } = action;
      const items = append ? [...customerItems, ...payload] : payload;
      return {
        ...state,
        customerItems: items,
        isLoading: false,
        isLoaded: true,
        noMoreData: payload.length < PAGE_SIZE
      };
    }
    case customersConstants.REMOVE_CONTACTS_SUCCESS: {
      return {
        ...state,
        contacts: state.contacts.filter(contact => !action.payload.includes(contact.id)),
        selectedContactIds: [],
        isLoading: false
      };
    }
    case customersConstants.SELECT_CONTACT: {
      const exists = state.selectedContactIds.includes(action.payload);
      return {
        ...state,
        selectedContactIds: exists
          ? state.selectedContactIds.filter(v => v !== action.payload)
          : state.selectedContactIds.concat(action.payload)
      };
    }
    case customersConstants.UPDATE_CONTACT_SUCCESS: {
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        isLoading: false,
        isLoaded: true
      };
    }
    case customersConstants.UPDATE_CUSTOMER_SUCCESS: {
      return {
        ...state,
        customerItems: state.customerItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        isLoading: false,
        isLoaded: true
      };
    }
    default:
      return state;
  }
};
