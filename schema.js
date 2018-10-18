const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


// //EmoployeeData
// const employeeDetails = [
//     {id:'1',name: 'Anuj Raval', email: 'anuj.digitalocean@gmail.com', age: 21, developerType: 'nodeDeveloper'},
//     {id:'2',name: 'Neel Patel', email: 'neel.digitalocean@gmail.com', age: 21, developerType: 'ReactDeveloper'},
//     {id:'3',name: 'Nilay Patel', email: 'nilay.digitalocean@gmail.com', age: 21, developerType: 'nodeDeveloper'}
// ];


// Customer Type
const EmployeeType = new GraphQLObjectType({
    name:'Employee',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
        developerType: {type: GraphQLString},
    })
});

// Root Query
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        employee:{
            type:EmployeeType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                /*
                for(let i = 0;i < customers.length;i++){
                    if(customers[i].id == args.id){
                        return customers[i];
                    }
                }
                */
                return axios.get('http://localhost:3000/employee/'+ args.id)
                    .then(res => res.data);

            }
        },
        employees:{
            type: new GraphQLList(EmployeeType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/employees')
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addEmployee:{
            type:EmployeeType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                developerType: {type: GraphQLString},
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/employees', {
                    name:args.name,
                    email: args.email,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        deleteEmployee:{
            type:EmployeeType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/employees/'+args.id)
                .then(res => res.data);
            }
        },
        editEmployee:{
            type:EmployeeType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt},
                developerType: {type: GraphQLString},
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/employees/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});