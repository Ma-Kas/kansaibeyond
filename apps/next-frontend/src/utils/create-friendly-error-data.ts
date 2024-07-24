import { ERRORS_DICTIONARY } from './backend-error-response-validation';

export const createFriendlyErrorData = (message: string) => {
  switch (message) {
    case ERRORS_DICTIONARY.BAD_REQUEST: {
      return {
        status: 400,
        name: message,
        description:
          "Seems like there is something wrong with the data. That's not on you, it's on us. It might be temporary, so you can either try to reload the page, or go back.",
      };
    }
    case ERRORS_DICTIONARY.NOT_FOUND: {
      return {
        status: 404,
        name: message,
        description:
          "Seems like we couldn't find some data you requested. It might have been removed, had its name changed, or is temporarily unavailable.",
      };
    }
    case ERRORS_DICTIONARY.SERVER_ERROR: {
      return {
        status: 500,
        name: message,
        description:
          'Seems like there was an error connecting to the server. Maybe it is down, or there is an issue with the connection. It might be temporary, so you can either try to reload the page, or go back.',
      };
    }
    default: {
      return {
        status: 500,
        name: message,
        description:
          "Seems like something just went very wrong. It can happen, and it just did. We're not sure why it happened, but you can try to reload the page, or go back.",
      };
    }
  }
};
