import  {ContactCollection}  from "../db/models/Contact.js";
import {calculatePaginationData} from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";


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


export const getContact = filter => ContactCollection.findOne(filter);

export const createContact = payload => ContactCollection.create(payload);



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


export const deleteContact = filter => ContactCollection.findOneAndDelete(filter);
