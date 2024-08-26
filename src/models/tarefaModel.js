import dbConnection from "../config/dbConnection.js"
import { DataTypes } from "sequelize";

const Tarefa = dbConnection.define("tarefas", {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true    
    },
    tarefa:{
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    descricao:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
        type: DataTypes.ENUM,
        values: ["pendente", "concluída"]
    }
},{
    tableName: "Tarefa"
  }
);

export default Tarefa;