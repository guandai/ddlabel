
import { Address } from "../models/Address";
import { Package } from "../models/Package";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";

export const defineRelations = () => {
	User.hasOne(Address, { as: 'warehouseAddress', foreignKey: 'userId', onDelete: 'CASCADE' });
	Address.belongsTo(User, { as: 'user', foreignKey: 'userId' });

	User.hasMany(Package, { as: 'packages', foreignKey: 'userId', onDelete: 'CASCADE' });
	Package.belongsTo(User, { as: 'user', foreignKey: 'userId' });

	User.hasMany(Transaction, { as: 'transactions', foreignKey: 'userId', onDelete: 'CASCADE' });
	Transaction.belongsTo(User, { as: 'user', foreignKey: 'userId' });

	Package.hasOne(Transaction, { as: 'transaction', foreignKey: 'packageId', onDelete: 'CASCADE' });
	Transaction.belongsTo(Package, { as: 'package', foreignKey: 'packageId' });

	Package.hasOne(Address, { as: 'fromAddress', foreignKey: 'fromPackageId', onDelete: 'CASCADE' });
	Address.belongsTo(Package, { as: 'fromPackage', foreignKey: 'fromPackageId' });

	Package.hasOne(Address, { as: 'toAddress', foreignKey: 'toPackageId', onDelete: 'CASCADE' });
	Address.belongsTo(Package, { as: 'toPackage', foreignKey: 'toPackageId' });
}
