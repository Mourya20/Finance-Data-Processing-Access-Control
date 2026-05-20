const prisma = require('../utils/prisma');

exports.createRecord = async (data) => {
  return prisma.record.create({
    data
  });
};

exports.updateRecord = (id, data) => {
  return prisma.record.update({
    where: { id },
    data
  });
};

exports.deleteRecord = (id) => {
  return prisma.record.delete({
    where: { id }
  });
};

exports.getRecords = (query) => {
  return prisma.record.findMany(query);
};