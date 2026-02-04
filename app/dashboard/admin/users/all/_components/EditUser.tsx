import React from "react";

interface Props {
  id: string;
}

const EditUser = ({ id }: Props) => {
  return <div>EditUser - {id}</div>;
};

export default EditUser;
