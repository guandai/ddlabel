export type MyType = {
	id: string;
	name: string;
};

export function myFunction(): MyType {
	return { id: '1', name: 'Shared Function' };
}
