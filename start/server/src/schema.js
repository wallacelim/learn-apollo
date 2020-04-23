const { gql } = require("apollo-server");

const typeDefs = gql`
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }
    type Rocket {
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]!
    }

    type Mission {
        name: String
        missionPatch(mission: String, size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }

    type Query {
        launches(
            """
            pageSize -> Number of results to show. Must be >= 1, default = 20
            """
            pageSize: Int
            """
            If a cursor is added here, results are returned only after the cursor
            """
            after: String
        ): LaunchConnection!
        launch(id: ID!): Launch
        me: User
    }

    """
    Simple wrapper around our list of launches that contains a cursor to the
    last item in the list. Pass this cursor to the launches query to fetch results
    after these.
    """
    type LaunchConnection {
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }

    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): String # login token
    }

    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
`;

module.exports = typeDefs;
