import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/Contact.js";  
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({...req.query, sortFields});
  const filter = parseFilterParams(req.query);
  const { _id: userId } = req.user;

  const data = await contactServices.getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
}
export const getContactByIdController = async (req, res) => {
        const { _id: userId } = req.user;
        const { contactId } = req.params;
        const data = await contactServices.getContact({_id:contactId, userId});
        
        if (!data) {
            throw createHttpError(404, `Contact with id=${contactId} not found`);
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data,
        });
};
    
export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await contactServices.createContact({ ...req.body, userId });
    res.status(201).json({
        status: 201,
        message: " Contact add successfully",
        data,
    });
}

export const upsertContactController = async(req, res)=> {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const {isNew, data} = await contactServices.updateContact({_id: contactId, userId}, req.body, {upsert: true});

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: "Contact upsert successfully",
    data,
  });
};

export const patchContactController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await contactServices.updateContact(studentId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};
export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const {contactId} = req.params;
  const data = await contactServices.deleteContact({_id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.status(204).send();
};
