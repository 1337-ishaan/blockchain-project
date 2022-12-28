import { OptionProps, Select } from "@web3uikit/core";
import { Dispatch, SetStateAction } from "react";
import { FilterItem } from "../utils/filterItem";

interface Props {
    setFilterItem: Dispatch<SetStateAction<FilterItem>>;
}

function Filter({ setFilterItem }: Props) {
    return (
        <div className="m-8">
            <Select
                width="300px"
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
                        case "My Created":
                            setFilterItem(FilterItem.MyCreated);
                            break;
                        case "My Approval":
                            setFilterItem(FilterItem.MyApproval);
                            break;
                        case "My Approved":
                            setFilterItem(FilterItem.MyApproved);
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
                    {
                        id: "my_created",
                        label: "My Created",
                    },
                    {
                        id: "my_approval",
                        label: "My Approval",
                    },
                    {
                        id: "my_approved",
                        label: "My Approved",
                    },
                ]}
            />
        </div>
    );
}

export default Filter;
