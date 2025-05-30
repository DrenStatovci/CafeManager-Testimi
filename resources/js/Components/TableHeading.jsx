import {ChevronUpIcon, ChevronDownIcon} from '@heroicons/react/24/solid'

export default function TableHeading ({
    name,
    sort_field,
    sort_direction,
    sortable =  true,
    sortChanged = () => {},
    children
}){
    return(
        <th onClick={e => sortChanged(name)} className="">
            <div className="px-3 py-2 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable &&
                (<div>
                    <ChevronUpIcon className={
                        "w-4 " +
                        (sort_field === name && sort_direction === "asc" ? "text-white" : "")
                        }
                    />
                    <ChevronDownIcon className={
                        'w-4 -mt-2 ' +
                        (sort_field === name && sort_direction ==='desc' ? "text-white" : "") 
                    }
                    />
                </div>)
                }
            </div>
        </th>
    )
}