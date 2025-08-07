export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class AdminPaginationDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}
