export enum Maps {
	MAP_1 = 'Map_1',
    MAP_2 = 'Map_2',
    MAP_3 = 'Map_3',
    MAP_4 = 'Map_4',
    MAP_5 = 'Map_5',
    MAP_6 = 'Map_6',
    MAP_7 = 'Map_7',
    MAP_8 = 'Map_8'
}

export const getMapByName = (key) => {
	return Maps[key];
};