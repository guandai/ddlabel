import { Models } from "@ddlabel/shared/dist/req-and-res";
import { formatNodeValue, skipTitle, spacedTitle } from "./styled";
import { GridNode, GridNodesSection } from "../types";
export const getRecursiveResult = (model: Models, title: string): GridNodesSection[] => {
	const gridNodesSections: GridNodesSection[] = [];

	const recursivePush = (model: Models, title: string) => {
		if (!model) return;
		if (skipTitle(title)) return;
		const gridNodes: GridNode[] = Object.entries(model).flatMap( ([key, value]) => {
			if (typeof value !== "object" || !value) {
				return {
					label: spacedTitle(key),
					value: formatNodeValue(key, value),
				};
			} else {
				recursivePush(value as Models, `${title} - ${key}`);
				return [];
			}
		});

		if (gridNodes.length > 0) {
			gridNodesSections.push({ title: spacedTitle(title), gridNodes });
		}
	};

	recursivePush(model, title);
	return gridNodesSections;
};

export default getRecursiveResult;
