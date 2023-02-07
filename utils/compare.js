export function sortByCountSortByName(list) {
	return list
		.sort((a, b) => a.name.localeCompare(b.name))
		.sort((a, b) => b.count - a.count)
		.sort((a, b) => a.voted - b.voted);
}
