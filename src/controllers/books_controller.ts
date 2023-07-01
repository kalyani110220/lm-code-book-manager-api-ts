import { Request, Response } from "express";
import * as bookService from "../services/books";
import { BadRequestError } from  '../errors/BadRequestError';

export const getBooks = async (req: Request, res: Response) => {
	try {
	  const books = await bookService.getBooks();
	  res.status(200).json(books); // OK
	} catch (error) {
	  res.status(500).json({ message: "Internal Server Error" });
	}
  };

  export const getBook = async (req: Request, res: Response) => {
	const bookId = Number.parseInt(req.params.bookId);
	
	try {
	  const book = await bookService.getBook(bookId);
	  if (book) {
		res.status(200).json(book); // OK
	  } else {
		res.status(404).json({ message: "Book not found" });
	  }
	} catch (error) {
	  res.status(500).json({ message: "Internal Server Error" });
	}
  };

export const saveBook = async (req: Request, res: Response) => {
	const bookToBeSaved = req.body;
	try {
		const book = await bookService.saveBook(bookToBeSaved);
		res.status(201).json(book); // Created
	  } catch (error) {
		if (error instanceof BadRequestError) {
		  res.status(400).json({ message: "Bad Request" });
		} else {
		  res.status(500).json({ message: "Internal Server Error" });
		}
	  }
	};

// User Story 4 - Update Book By Id Solution
export const updateBook = async (req: Request, res: Response) => {
	try {
	  const bookUpdateData = req.body;
	  const bookId = Number.parseInt(req.params.bookId);
  
	  const book = await bookService.updateBook(bookId, bookUpdateData);
	  res.status(204).json(book);
	} catch (error: any) {
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
//User Story 5 - Delete Book By Id Solution
export const deleteBookById = async (req: Request, res: Response) => {
	const bookId = Number.parseInt(req.params.bookId);
  
	try {
	  await bookService.deleteBookById(bookId);
	  res.sendStatus(204); 
	} catch (error) {
	  res.status(404).json({ message: "Book not found" }); 
	}
  };