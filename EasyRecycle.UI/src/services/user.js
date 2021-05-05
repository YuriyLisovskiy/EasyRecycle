import BaseService from "./base";

class UserService extends BaseService {

	constructor() {
		super();
		this._URL_CORE = this._BASE_URL + '/core';
		this._URL_USERS = this._URL_CORE + '/users';
		this._URL_ADMIN_USERS = this._URL_CORE + '/admin/users';
		this._URL_SELF = this._URL_USERS + '/self';
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "username": <string>,
	//    "email": <string>,
	//    "avatar_link": <string (full url)>,
	//    "is_superuser": <bool>,
	//    "is_banned": <bool>,
	//    "is_garbage_collector": <bool>,
	//    "is_commercial": <bool>,
	//    "rating": <int>,
	//    "show_full_name": <bool>
	//  }
	getUser = (id, handler) => {
		return this.get({
			url: this._URL_USERS + '/' + id.toString()
		}, handler);
	}

	// returns:
	//  [
	//    {
	//      "id": <int>,
	//      "first_name": <string>,
	//      "last_name": <string>,
	//      "username": <string>,
	//      "email": <string>,
	//      "avatar_link": <string (full url)>,
	//      "is_superuser": <bool>,
	//      "is_banned": <bool>,
	//      "is_garbage_collector": <bool>,
	//      "is_commercial": <bool>,
	//      "rating": <int>,
	//      "show_full_name": <bool>
	//    },
	//    ...
	//  ]
	getUsers = (garbage_collectors, page, order_by, handler) => {
		let query = [];
		if (garbage_collectors === true)
		{
			query.push("garbage_collectors=true");
		}

		if (page)
		{
			query.push("page=" + page.toString());
		}

		if (order_by)
		{
			query.push('order_by=' + order_by);
		}

		return this.get({
			url: this._URL_USERS + (query.length > 0 ? ("?" + query.join('&')) : "")
		}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "username": <string>,
	//    "email": <string>,
	//    "avatar_link": <string (full url)>,
	//    "is_superuser": <bool>,
	//    "is_garbage_collector": <bool>,
	//    "is_commercial": <bool>,
	//    "rating": <int>,
	//    "show_full_name": <bool>
	//  }
	getMe = (handler) => {
		return this.get({url: this._URL_SELF}, handler);
	}

	// returns:
	//  {
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "avatar_link": <string> (full url),
	//    "show_full_name": <bool>
	//  }
	editUser = (id, firstName, lastName, showFullName, showRating, handler) => {
		let data = {};
		if (firstName !== null) {
			data['first_name'] = firstName;
		}

		if (lastName !== null) {
			data['last_name'] = lastName;
		}

		if (showFullName !== null) {
			data['show_full_name'] = showFullName;
		}

		if (showRating !== null) {
			data['show_rating'] = showRating;
		}

		this.put({
			url: this._URL_SELF + '/edit',
			data: data
		}, handler);
	}

	// returns:
	//  {
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "avatar_link": <string> (full url),
	//    "show_full_name": <bool>
	//  }
	updateAvatar = (id, avatar, handler) => {
		let formData = new FormData();
		if (avatar) {
			formData.append('avatar', avatar);
		}

		this.put({
			url: this._URL_SELF + '/edit/avatar',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}, handler);
	}

	editEmail = (id, email, password, handler) => {
		this.put({
			url: this._URL_SELF + '/edit/email',
			data: {
				email: email,
				password: password
			}
		}, handler);
	}

	editPassword = (id, oldPassword, newPassword, handler) => {
		this.put({
			url: this._URL_SELF + '/edit/password',
			data: {
				old_password: oldPassword,
				new_password: newPassword
			}
		}, handler);
	}

	deactivateMe = (id, password, handler) => {
		this.put({
			url: this._URL_SELF + '/deactivate',
			data: {
				password: password
			}
		}, handler);
	}

	becomeCommercial = (id, password, handler) => {
		this.put({
			url: this._URL_SELF + '/become-commercial',
			data: {
				password: password
			}
		}, handler);
	}

	// Administration privileges are required.
	// returns:
	// {}
	banUser = (userId, handler) => {
		this.put({
			url: this._URL_ADMIN_USERS + '/' + userId.toString() + '/ban'
		}, handler);
	}

	// Administration privileges are required.
	// returns:
	// {}
	unbanUser = (userId, handler) => {
		this.put({
			url: this._URL_ADMIN_USERS + '/' + userId.toString() + '/unban'
		}, handler);
	}
}

export default new UserService();
