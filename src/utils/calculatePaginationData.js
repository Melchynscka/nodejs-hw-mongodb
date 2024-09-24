const calculatePaginationData = ({ count, perPage, page }) => {
    const totalPages = Math.ceil(count / perPage);
    const hasPreviousPage = page < totalPages;
    const hasNextPage = page !== 1;
    return {
        totalPages,
        hasPreviousPage,
        hasNextPage
    }
}
export default calculatePaginationData;