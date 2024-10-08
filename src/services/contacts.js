import  ContactCollection  from "../db/models/Contact.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

// export const getAllContacts = async ({
//     perPage,
//     page,
//     sortBy = "_id",
//     sortOrder = SORT_ORDER[0],
//     filter = {},
// }) => {
//     const skip = (page - 1) * perPage;
//     const contacts = await ContactCollection.find(userId).skip(skip).limit(perPage).sort({[sortBy]:sortOrder });
//     const count = await ContactCollection.find(userId).countDocuments();
//     const paginationData = calculatePaginationData({ count, perPage, page, userId });
//     return {
//         perPage,
//         page,
//         contacts,
//         totalItems: count,userId,
//         ...paginationData
//     };
// } ;
export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER[0],
  sortBy = '_id',
  filter = {},
 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  let contactsQuery = ContactCollection.find();

  if (filter.userId) {
    contactsQuery = contactsQuery.where('userId').eq(filter.userId);
  }

  if (filter.type) {
    contactsQuery = contactsQuery.where('contactType').eq(filter.type);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery = contactsQuery.where('isFavourite').eq(filter.isFavourite);
  }

  const contactsCount = await ContactCollection.find().merge(contactsQuery).countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

// export const getContactById =async (contactId, user) => {
//     const contacts = await ContactCollection.findById({
//         _id: contactId,
//         userId: user._id,
//     });
//     return contacts;
// };
export const getContact = filter => ContactCollection.findById(filter);

export const createContact = payload => ContactCollection.create(payload);
// export const createContact = async (payload) => {
//   const contact = await ContactCollection.create(payload);
//   return contact;
// };


export const updateContact = async(filter, data, options = {})=> {
    const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
        includeResultMetadata: true,
        ...options,
    });

    if(!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};
// export const updateContact = async (contactId, userId, payload, options = {}) => {
//   const rawResult = await ContactCollection.findOneAndUpdate(
//     { _id: contactId, userId,},
//     payload,
//     {
//       new: true,
//       includeResultMetadata: true,
//       ...options,
//     },
//   );

//   if (!rawResult || !rawResult.value) return null;

//   return {
//     contact: rawResult.value,
//     isNew: Boolean(rawResult?.lastErrorObject?.upserted),
//   };
// };

export const deleteContact = filter => ContactCollection.findOneAndDelete(filter);
// export const deleteContact = async (contactId, userId) => {
//   const contact = await ContactCollection.findOneAndDelete({
//     _id: contactId,
//     userId,
//   });

//   return contact;
// };