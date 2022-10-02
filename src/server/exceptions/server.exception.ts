class ServerException extends Error {
	message: string;
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.message = message;
		this.code = code;
	}

	static UnauthorizedError(): ServerException {
		return new ServerException('User not authorized.', 401);
	}

	static WrongAuthData(): ServerException {
		return new ServerException('Wrong username or password.', 400);
	}

	static UserNotFound(): ServerException {
		return new ServerException('User with this data(puuid) not found.', 400);
	}
}

export default ServerException;
