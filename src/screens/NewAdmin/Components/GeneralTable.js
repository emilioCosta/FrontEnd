import React from 'screens/NewAdmin/components/node_modules/react';
import MaterialTable from 'screens/NewAdmin/components/node_modules/material-table';

function GeneralTable(props) {
  const {value, setValue, columnNames} = props;

  return (
    <div>
      <MaterialTable
        options={{
          paging: true, 
          pageSize: 5, 
          pageSizeOptions: [5, 10, 50],
          sorting: true,
          exportButton: true,
          actionsColumnIndex: -1,
          addRowPosition: 'first'
        }}
        title=""
        columns={columnNames}
        data={value}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setValue([newData, ...value]);
                resolve();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...value];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setValue([...dataUpdate]);
                resolve();
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...value];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setValue([...dataDelete]);
                resolve();
              }, 600);
            }),
        }}
      />
    </div>
  );
}

export default GeneralTable;