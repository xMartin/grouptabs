define([
	'./db'
], function (db) {
	"use strict";

	return {

		_cache: {},

		init: function (tabId) {
			return db.init(tabId)
				.then(function () {
					db.setupChangesListener(this._handleDbChange.bind(this));
					db.sync();
					// explicitely cancel syncing, an error is thrown by pouchdb otherwise
					window.addEventListener('unload', function () {
						db.stopSyncing();
					});
				}.bind(this))
				.then(this._refreshFromDb.bind(this));
		},

		_refreshFromDb: function () {
			return db.getTransactions().then(function (transactions) {
				this._cache.transactions = this._sortTransactions(transactions);
				this._cache.accounts = this._transactions2Accounts(transactions);
				this._cache.participants = this._accounts2Participants(this._cache.accounts);
			}.bind(this));
		},

		getTransactions: function () {
			return this._cache.transactions;
		},

		getAccounts: function () {
			return this._cache.accounts;
		},

		getParticipants: function () {
			return this._cache.participants;
		},

		setupChangesListener: function (callback) {
			this._dbChangeCallback = callback;
		},

		_handleDbChange: function () {
			this._refreshFromDb().then(this._dbChangeCallback);
		},

		_sortTransactions: function (transactions) {
			// order transactions by date and timestamp descending
			return transactions.sort(function (a, b) {
				if (a.date > b.date) {
					return -1;
				} else if (a.date < b.date) {
					return 1;
				} else {  // ===
					if (a.timestamp > b.timestamp) {
						return -1;
					} else {
						return 1;
					}
				}
			});
		},

		_transactions2Accounts: function (transactions) {
			var participants = {};
			transactions.forEach(function (transaction) {
				var total = 0;
				transaction.participants.forEach(function (participant) {
					total += participant.amount || 0;
				});
				var share = total / transaction.participants.length;
				transaction.participants.forEach(function (participant) {
					var amount = participant.amount || 0;
					var participantName = participant.participant;
					var storedAmount = participants[participantName] || 0;
					var newAmount = storedAmount - share + amount;
					participants[participantName] = newAmount;
				});
			});
			var result = [];
			for (var participant in participants) {
				var resultObj = {};
				resultObj.participant = participant;
				resultObj.amount = participants[participant];
				result.push(resultObj);
			}
			result.sort(function (a, b) {
				return a.amount < b.amount ? -1 : 1
			});
			return result;
		},

		_accounts2Participants: function (accounts) {
			return accounts.map(function (account) {
				return account.participant;
			});
		}

	};

});
