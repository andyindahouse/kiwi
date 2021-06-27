import {PaginatedResponse, PantryProduct} from '@kiwi/models';

export const pantry: PaginatedResponse<ReadonlyArray<PantryProduct>> = {
    pageNumber: 0,
    pageSize: 10,
    totalSize: 0,
    content: [],
};
