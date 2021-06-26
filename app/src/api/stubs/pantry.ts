import {PaginatedResponse, PantryProduct} from '../../models';

export const pantry: PaginatedResponse<ReadonlyArray<PantryProduct>> = {
    pageNumber: 0,
    pageSize: 10,
    totalSize: 0,
    content: [],
};
