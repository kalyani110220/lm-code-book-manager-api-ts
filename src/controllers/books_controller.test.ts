import * as bookService from "../services/books";
import request from "supertest";
import { app } from "../app";
import { Book } from "../models/book";
import { BadRequestError } from  '../errors/BadRequestError';

jest.mock("../services/books");

const dummyBookData = [
	{
		bookId: 1,
		title: "The Hobbit",
		author: "J. R. R. Tolkien",
		description: "Someone finds a nice piece of jewellery while on holiday.",
	},
	{
		bookId: 2,
		title: "The Shop Before Life",
		author: "Neil Hughes",
		description:
			"Before being born, each person must visit the magical Shop Before Life, where they choose what kind of person they will become down on Earth...",
	},
];

afterEach(() => {
	jest.clearAllMocks();
});

describe("GET /api/v1/books endpoint", () => {
	test("status code successfully 200", async () => {
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("books successfully returned as empty array when no data", async () => {
		// Arrange
		jest.spyOn(bookService, "getBooks").mockResolvedValue([]);
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual([]);
		expect(res.body.length).toEqual(0);
	});

	test("books successfully returned as array of books", async () => {
		// Arrange

		// NB the cast to `Book[]` takes care of all the missing properties added by sequelize
		//    such as createdDate etc, that we don't care about for the purposes of this test
		jest
			.spyOn(bookService, "getBooks")
			.mockResolvedValue(dummyBookData as Book[]);

		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual(dummyBookData);
		expect(res.body.length).toEqual(2);
	});
});

describe("GET /api/v1/books/{bookId} endpoint", () => {
	test("status code successfully 200 for a book that is found", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("status code successfully 404 for a book that is not found", async () => {
		// Arrange

		jest
			.spyOn(bookService, "getBook")
			// this is a weird looking type assertion!
			// it's necessary because TS knows we can't actually return unknown here
			// BUT we want to check that in the event a book is missing we return a 404
			.mockResolvedValue(undefined as unknown as Book);
		// Act
		const res = await request(app).get("/api/v1/books/77");

		// Assert
		expect(res.statusCode).toEqual(404);
	});

	test("controller successfully returns book object as JSON", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.body).toEqual(dummyBookData[1]);
	});
});

describe("POST /api/v1/books endpoint", () => {
	test("status code 201 for saving a valid book", async () => {
	  // Act
	  const res = await request(app)
		.post("/api/v1/books")
		.send({ bookId: 3, title: "Fantastic Mr. Fox", author: "Roald Dahl" });
  
	  // Assert
	  expect(res.statusCode).toEqual(201);
	});
  
	test("status code 400 when saving ill-formatted JSON", async () => {
		// Arrange - we can enforce throwing a BadRequestError by mocking the implementation
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
		  throw new BadRequestError("Error saving book");
		});
	  
		// Act
		const res = await request(app)
		  .post("/api/v1/books")
		  .send({ title: "Fantastic Mr. Fox", author: "Roald Dahl" }); // No bookId
	  
		// Assert
		expect(res.statusCode).toEqual(400);
	  });
	  
  });
describe("Update /api/v1/books endpoint", () => {
  test("status code 204 when updating a book", async () => {
	// Arrange
	const bookId = 1;
	const bookUpdateData = { title: "New Title", author: "New Author" };
	jest.spyOn(bookService, "updateBook").mockImplementation(); // Mock the updateBook function
  
	// Act
	const res = await request(app)
	  .put(`/api/v1/books/${bookId}`)
	  .send(bookUpdateData);
  
	// Assert
	expect(res.statusCode).toEqual(204);
  });
});
  
	describe('DELETE /api/v1/books/:bookId', () => {
		test('should delete a book and return 204 status code', async () => {
		  // Arrange
		  const bookId = 1;
		  jest.spyOn(bookService, 'deleteBookById');
	  
		  // Act
		  const response = await request(app).delete(`/api/v1/books/${bookId}`);
	  
		  // Assert
		  expect(response.status).toBe(204);
		  expect(bookService.deleteBookById).toHaveBeenCalledWith(bookId);
		});
	  
		test('should return 404 status code when book is not found', async () => {
		  // Arrange
		  const bookId = 1;
		  jest.spyOn(bookService, 'deleteBookById').mockImplementation(() => {
			throw new Error('Book not found');
		  });
	  
		  // Act
		  const response = await request(app).delete(`/api/v1/books/${bookId}`);
	  
		  // Assert
		  expect(response.status).toBe(404);
		  expect(response.body).toEqual({ message: 'Book not found' });
		});

	  });
	  
