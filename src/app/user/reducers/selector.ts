import { Product } from './../../core/models/product';
import { AppState } from './../../interfaces';
import { createSelector } from 'reselect';
import { UserState } from './user.state';
import { List } from 'immutable';
import { Order } from '../../core/models/order';
import { Address } from '../../core/models/address';

// Base product state function
/**
 *
 *
 * @param {AppState} state
 * @returns {UserState}
 */
function getUserState(state: AppState): UserState {
    return state.users;
}

// ******************** Individual selectors ***************************
/**
 *
 *
 * @param {UserState} state
 * @returns {Order[]}
 */
const fetchUserOrders = function(state: UserState): Order[] {
    return state.orders.toJS();
};

const fetchUserFavoriteProducts = function(state: UserState): Product[] {
    return state.favorite_products.toJS();
}

export function fetchUserAddresses(state: UserState): Address[] {
    return state.userAddresses.toJS();
}

// *************************** PUBLIC API's ****************************
export const getUserOrders = createSelector(getUserState, fetchUserOrders);
export const getUserFavoriteProducts = createSelector(getUserState, fetchUserFavoriteProducts);
export const getUserAddressess = createSelector(getUserState, fetchUserAddresses);

