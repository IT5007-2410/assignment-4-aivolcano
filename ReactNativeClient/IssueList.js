import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDropdown from 'react-native-modal-dropdown';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
	Alert,
  } from 'react-native';


  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  function Hr(props) {
  return (<>
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 5,
      }}
    />
  </>);
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://172.31.87.198:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
	  console.log(e)
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
	  const systemname = this.props.name;
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={stylesFilter.filter}>This is a placeholder for the issue filter for {systemname}</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const stylesFilter = StyleSheet.create({
  filter: {
    backgroundColor: 'lightgrey',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];

function formatTime(timestamp, format) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  let formatted_time = format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds);
  return formatted_time;
}

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    let { id, title, status, owner, created, effort, due } = issue
    if (!due) {
      due = "-"
    } else {
      due = formatTime(due,"yyyy-MM-dd")
    }
    if (!created) {
      created = "-"
    } else {
      created = formatTime(due,"yyyy-MM-dd")
    }
    const newdata2 = [id,title,status,owner,formatTime(created, "yyyy-MM-dd"),effort,due]
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row key={props.key} data={newdata2} styles={stylesTable.row} textStyle={stylesTable.text}>
        <Cell style={stylesTable.cell} data={id} />
        <Cell style={stylesTable.cell} data={title} />
        <Cell style={stylesTable.cell} data={status} />
        <Cell style={stylesTable.cell} data={owner} />
        <Cell style={stylesTable.cell} data={created} />
        <Cell style={stylesTable.cell} data={effort} />
        <Cell style={stylesTable.cell} data={due} />
      </Row>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
	  const tableHead = ['id','title','status', 'owner', 'created', 'effort', 'due'];
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={stylesTable.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}> IssueList Table </Text>
      <ScrollView horizontal={false}>
        <Table>
          <Row data={tableHead} style={stylesTable.head} textStyle={stylesTable.text} >
            <Cell style={stylesTable.cell} data={'id'} />
            <Cell style={stylesTable.cell} data={'title'} />
            <Cell style={stylesTable.cell} data={'status'} />
            <Cell style={stylesTable.cell} data={'owner'} />
            <Cell style={stylesTable.cell} data={'created'} />
            <Cell style={stylesTable.cell} data={'effort'} />
            <Cell style={stylesTable.cell} data={'due'} />
          </Row>
          {issueRows}
        </Table>
      </ScrollView>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }


const stylesTable = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 0, backgroundColor: '#fff' },
  head: { height: 30, backgroundColor: '#f1f8ff', fontWeight: 'bold' },
  text: { margin: 0, textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  cell: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: 10,
  },
});

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      this.showDatePicker = this.showDatePicker.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);

      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
        id: '',
        title: '',
        owner: '',
        effort: '',
        due: '',
        status: 'New',
        created: '',
        showDatePicker: false,
        DateChanged: false,
        }
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleInputChange(field, value) {
      this.setState({ [field]: value });
    };

    showDatePicker() {
        this.setState({ due: new Date(), showDatePicker: true });
    };
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { title, owner, effort, due, status, DateChanged } = this.state;
        let ans = ['', 'New', 'Assigned', 'Fixed', 'Closed']
        if (!title || !owner || !effort || !DateChanged || !ans.includes(status)) {
          Alert.alert(
            'Error',
            'Please finish the add form!',
            [
              { text: 'OK'},
              { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: false },
          )
          return;
        } else if (isNaN(effort)) {
          Alert.alert(
            'Error',
            'effort must be number!',
            [
              { text: 'OK' },
              { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: false },
          )
          return;
        }
        let issue;
        if (status) {
          issue = { title, owner, effort, due, status }
        } else {
          issue = { title, owner, effort, due }
        }
        console.log("handleSubmit----", issue);
        this.props.createIssue(issue)
        
        this.setState({
          title: '',
          owner: '',
          effort: '',
          due: '',
          status: 'New',
        });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      const { title, owner, effort, due, status } = this.state;
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <View style={stylesAdd.container}>
              <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}> Add IssueList </Text>
              <Text style={stylesAdd.label}>Title:</Text>
              <TextInput
                style={stylesAdd.input}
                value={title}
                onChangeText={(value) => this.handleInputChange('title', value)}
              />

              <Text style={stylesAdd.label}>Owner:</Text>
              <TextInput
                style={stylesAdd.input}
                value={owner}
                onChangeText={(value) => this.handleInputChange('owner', value)}
              />

              <Text style={stylesAdd.label}>Status: (Optional)</Text>
              <ModalDropdown
                options={['New', 'Assigned', 'Fixed', 'Closed']}
                style={stylesAdd.dropdown}
                textStyle={stylesAdd.dropdownText}
                dropdownStyle={stylesAdd.dropdownList}
                dropdownTextStyle={stylesAdd.dropdownListItemText}
                renderRow={(option, index, isSelected) => (
                  <View style={styles.dropdownListItem}>
                    <Text style={styles.dropdownListItemText}>{option}</Text>
                  </View>
                )}
                onSelect={(idx, selectedStatus) => this.handleInputChange('status', selectedStatus)}
              ><Text style={stylesAdd.dropdownText}>{this.state.status}</Text>
              </ModalDropdown>
              
              <Text style={stylesAdd.label}>Effort:</Text>
              <TextInput
                style={stylesAdd.input}
                value={effort}
                onChangeText={(value) => this.handleInputChange('effort', value)}
              />

              <Text style={stylesAdd.label}>Due Date:</Text>
              <Button title="Select Date" onPress={this.showDatePicker} />
              {this.state.showDatePicker && (
                <DateTimePicker
                  value={due}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || due;
                    this.setState({ due: currentDate, showDatePicker: false, DateChanged: true });
                  }}

                />
              )}
              <Text style={stylesAdd.time}>{this.state.due ? formatTime(this.state.due, 'Selected Due Date: yyyy-MM-dd') : "Please select a time!"}</Text>
              <Button title="Add Task" onPress={this.handleSubmit} styles={stylesAdd.button} />
            </View>
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

const stylesAdd = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 5,
    textAlign: 'center'
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 10
  },
  button: {
    marginBottom: 10,
  },
  dropdown: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 17,
    color: '#333',
  },
  dropdownIcon: {
    marginLeft: 10,
    fontSize: 20,
    color: '#888',
  },
  dropdownList: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dropdownListItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownListItemText: {
    fontSize: 17,
    color: '#333',
  },
});    
            
class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { name: '' };
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newname) {this.setState({ name: newname });}
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const { name } = this.state;
    console.log("handleSubmit", name);
    if (name) {
      this.props.addToBlacklist(name);
    } else {
      Alert.alert(
        'Error','Please enter a name in the Blacklist!',
        [{ text: 'OK', }, { text: 'Cancel', style: 'cancel' },],
        { cancelable: false },
      )
      return;
    }
    this.setState({ name: '' });
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}> Add BlackList</Text>
        <TextInput ref={input => { this.newnameInput = input}} placeholder="Add Blacklist User" onChangeText={newname=>this.setName(newname)}/>
        <Button onPress={this.handleSubmit} title="Add To blacklist"/>
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;
    console.log("createIssue---", issue);
    console.log("createquery---", query);
    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
  }

  async addToBlacklist(nameInput) {
    const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput)
    }`;

    const {addToBlacklist} = await graphQLFetch(query, { nameInput });
  }


  render() {
    return (
    <>
      <ScrollView>
    {/****** Q1: Start Coding here. ******/}
       <Hr />
          <IssueFilter name={"A0279828E"} />
       <Hr />
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues} />
    <Hr />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue} />
    <Hr />
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList addToBlacklist={this.addToBlacklist} />
    {/****** Q4: Code Ends here. ******/}
    </ScrollView>
    </>
      
    );
  }
}
