import { OptionProps, Select } from "@web3uikit/core";
import { Dispatch, SetStateAction } from "react";
import { FilterItem } from "../utils/filterItem";

interface Props {
    setFilterItem: Dispatch<SetStateAction<FilterItem>>;
}

function Filter({ setFilterItem }: Props) {
    return (
        <Select
            name="Filter Contracts"
            defaultOptionIndex={0}
            id="Select"
            label="Filter Contracts"
            onChange={function noRefCheck(option) {
                const { label }: any = option;

                switch (label) {
                    case "All":
                        setFilterItem(FilterItem.All);
                        break;
                    case "Approved":
                        setFilterItem(FilterItem.Approved);
                        break;
                    case "Unapproved":
                        setFilterItem(FilterItem.Unapproved);
                        break;
                }
            }}
            options={[
                {
                    id: "all",
                    label: "All",
                },
                {
                    id: "approved",
                    label: "Approved",
                },
                {
                    id: "unapproved",
                    label: "Unapproved",
                },
            ]}
        />
    );
}

export default Filter;
