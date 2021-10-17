package business

type InternalVariable struct {
	Key   	string  `db:"key"`
	Value 	string  `db:"value"`
}

type InternalVariables []InternalVariable
