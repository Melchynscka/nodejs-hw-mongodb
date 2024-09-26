const calculatePaginationData = ({ count, perPage, page }) => {
    const totalPages = Math.ceil(count / perPage);
    const hasPreviousPage = page !== 1;
    const hasNextPage = Boolean(totalPages - page);
    return {
        totalPages,
        hasPreviousPage,
        hasNextPage
    }
}
export default calculatePaginationData;