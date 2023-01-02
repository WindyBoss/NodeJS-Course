# DataBases
* DataBase - the virtual place in server machine, which collect and hold data, which can be used everywhere and every time

## Types of Database's
1. Hierarchical databases.
Just as in any hierarchy, this database follows the progression of data being categorized in ranks or levels, wherein data is categorized based on a common point of linkage. As a result, two entities of data will be lower in rank and the commonality would assume a higher rank.
Do note how Departments and Administration are entirely unlike each other and yet fall under the domain of a University. They are elements that form this hierarchy. 

Another perspective advises visualizing the data being organized in a parent-child relationship, which upon addition of multiple data elements would resemble a tree. The child records are linked to the parent record using a field, and so the parent record is allowed multiple child records. However, vice versa is not possible. 

Notice that due to such a structure, hierarchical databases are not easily salable; the addition of data elements requires a lengthy traversal through the database. 

2. Network databases.
In Layman’s terms, a network database is a hierarchical database, but with a major tweak. The child records are given the freedom to associate with multiple parent records. As a result, a network or net of database files linked with multiple threads is observed. Notice how the Student, Faculty, and Resources elements each have two-parent records, which are Departments and Clubs. 
Certainly, a complex framework, network databases are more capable of representing two-directional relationships. Also, conceptual simplicity favors the utilization of a simpler database management language. 

The disadvantage lies in the inability to alter the structure due to its complexity and also in it being highly structurally dependent. 

1. Object-oriented databases
Those familiar with the Object-Oriented Programming Paradigm would be able to relate to this model of databases easily. Information stored in a database is capable of being represented as an object which response as an instance of the database model. Therefore, the object can be referenced and called without any difficulty. As a result, the workload on the database is substantially reduced. 
In the chart above, we have different objects linked to one another using methods; one can get the address of the Person (represented by the Person Object) using the livesAt() method. Furthermore, these objects have attributes which are in fact the data elements that need to be defined in the database. 

An example of such a model is the Berkeley DB software library which uses the same conceptual background to deliver quick and highly efficient responses to database queries from the embedded database. 

1. Relational databases
Considered the most mature of all databases, these databases lead in the production line along with their management systems. In this database, every piece of information has a relationship with every other piece of information. This is on account of every data value in the database having a unique identity in the form of a record. 

Note that all data is tabulated in this model. Therefore, every row of data in the database is linked with another row using a primary key. Similarly, every table is linked with another table using a foreign key. 

Due to this introduction of tables to organize data, it has become exceedingly popular. In consequence, they are widely integrated into Web-Ap interfaces to serve as ideal repositories for user data. What makes it further interesting is the ease in mastering it, since the language used to interact with the database is simple (SQL in this case) and easy to comprehend. 

It is also worth being aware of the fact that in Relational databases, scaling and traversing through data is quite a light-weighted task in comparison to Hierarchical Databases. 

5. NoSQL databases.
A NoSQL originally referring to non SQL or non-relational is a database that provides a mechanism for storage and retrieval of data. This data is modeled in means other than the tabular relations used in relational databases. 

A NoSQL database includes simplicity of design, simpler horizontal scaling to clusters of machines, and finer control over availability. The data structures used by NoSQL databases are different from those used by default in relational databases which makes some operations faster in NoSQL. The suitability of a given NoSQL database depends on the problem it should solve. Data structures used by NoSQL databases are sometimes also viewed as more flexible than relational database tables. 

MongoDB falls in the category of NoSQL document-based database. 

**Advantages of NoSQL**
There are many advantages of working with NoSQL databases such as MongoDB and Cassandra. The main advantages are high scalability and high availability. 

**Disadvantages of NoSQL** 
NoSQL has the following disadvantages:  
- NoSQL is an open-source database.
- GUI is not available
- Backup is a weak point for some NoSQL databases like MongoDB.
- Large document size. 


## Difference between MongoDB and Relational databases (SQL)
- data is not strictly limited by model. For example entities (objects) can have different fields. In SQL in strictly limited fields.

## MongoDB 
- Mongoose
- MongoDB Compass 