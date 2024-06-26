'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address1: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      zip: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      addressType: {
        type: Sequelize.ENUM('toPackage', 'fromPackage', 'user'),
        allowNull: false,
        defaultValue: 'toPackage',
      },
      fromPackageId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'packages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      toPackageId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'packages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      proposal: {
        type: Sequelize.ENUM('LAX', 'JFK', 'ORD', 'SFO', 'DFW', 'MIA', 'ATL', 'BOS', 'SEA'),
        allowNull: true,
      },
      sortCode: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
    });

    await queryInterface.createTable('packages', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      length: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      trackingNo: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      referenceNo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      source: {
        type: Sequelize.ENUM('manual', 'api'),
        allowNull: false,
        defaultValue: 'manual',
      },
      souceName: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });

    await queryInterface.createTable('postal_zones', {
      zip: {
        type: Sequelize.STRING(5),
        allowNull: false,
        primaryKey: true,
      },
      new_sort_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      sort_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      remote_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      proposal: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      start_zip: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      open_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      LAX: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      SFO: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      ORD: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      JFK: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      ATL: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      DFW: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      MIA: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      SEA: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      BOS: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      PDX: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.createTable('shipping_rates', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      weightRange: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      zone1: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone2: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone3: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone4: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone5: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone6: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone7: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      zone8: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    await queryInterface.createTable('sort_code', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      proposal: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      zip: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      sortCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('states', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      zip: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });

    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      packageId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'packages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      dateAdded: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      event: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tracking: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'worker'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('zip_codes', {
      zip: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      lat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: true,
      },
      lng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state_id: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      zcta: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      parent_zcta: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      county_fips: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      county: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('packages');
    await queryInterface.dropTable('postal_zones');
    await queryInterface.dropTable('shipping_rates');
    await queryInterface.dropTable('sort_code');
    await queryInterface.dropTable('states');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('zip_codes');
  },
};
