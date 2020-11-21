export enum Maps {
	MAP_1 = 'Map_1',
	MAP_2 = 'Map_2',
}

export const getMapByName = (key) => {
	return Maps[key];
};