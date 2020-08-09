const colorSet = [
  {color: "black"},
  {color: "darkslategrey"},
  {color: "dimgrey"},
  {color: "grey"},
  {color: "lightgrey"},
  {color: "beige"},
  {color: "white"},
  {color: "maroon"},
  {color: "saddlebrown"},
  {color: "darkgoldenrod"},
  {color: "goldenrod"},
  {color: "rosybrown"},
  {color: "wheat"},
  {color: "navy"},
  {color: "blue"},
  {color: "dodgerblue"},
  {color: "deepskyblue"},
  {color: "aquamarine"},
  {color: "cyan"},
  {color: "olive"},
  {color: "darkgreen"},
  {color: "green"},
  {color: "springgreen"},
  {color: "limegreen"},
  {color: "palegreen"},
  {color: "lime"},
  {color: "greenyellow"},
  {color: "darkslateblue"},
  {color: "slateblue"},
  {color: "purple"},
  {color: "fuchsia"},
  {color: "plum"},
  {color: "orchid"},
  {color: "lavender"},
  {color: "darkkhaki"},
  {color: "khaki"},
  {color: "lemonchiffon"},
  {color: "yellow"},
  {color: "gold"},
  {color: "orangered"},
  {color: "orange"},
  {color: "coral"},
  {color: "lightpink"},
  {color: "palevioletred"},
  {color: "deeppink"},
  {color: "darkred"},
  {color: "crimson"},
  {color: "red"}       
];

function mySettings(props) {
  return (
    <Page>
      
      <Section
        title={<Text bold align="center">Focus-Break! Settings</Text>}>        
        <Toggle
          settingsKey="timeFormatToggle"
          label="12 Hr TimeFormat: "
        />      
        <TextInput
          label="Work Mode Start Time: "
          title="Focus-Break!"
          settingsKey="workStartTime"
          type="time"/>        
        <TextInput
          label="Work Mode End Time: "
          title="Focus-Break!"
          settingsKey="workEndTime"
          type="time"/>        
      </Section>    
      
      <Section
        title={<Text bold align="center">Custom Focus-Break! message</Text>}>        
        
        <TextInput
            label="Focus Mode Text Message"
            type="text"
            settingsKey="focusText"
            maxlength = "15"
          />
        <TextInput
            label="Break Mode Text Message"
            type="text"
            settingsKey="breakText"
            maxlength = "15"
          />                
      </Section>   
     
      
      <Section
        title={<Text bold align="center">Focus Mode Settings</Text>}>  
        
        <Text>Select the background color when in focus mode:</Text>        
        <ColorSelect
          settingsKey="f_backColor"
          colors={colorSet}
        />
        
        <Text>Select time text color when in focus mode:</Text>    
        <ColorSelect
          settingsKey="f_timeColor"
          colors={colorSet}
        /> 
        
        <Text>Select message text color when in focus mode:</Text>            
        <ColorSelect
          settingsKey="f_msgColor"
          colors={colorSet}
        />
      </Section> 
      
      <Section
        title={<Text bold align="center">Break Mode Settings</Text>}>  
        
        <Text>Select the background color when in break mode:</Text>        
        <ColorSelect
          settingsKey="b_backColor"
          colors={colorSet}
        />
        
        <Text>Select time text color when in break mode:</Text>    
        <ColorSelect
          settingsKey="b_timeColor"
          colors={colorSet}
        /> 
        
        <Text>Select message text color when in break mode:</Text>            
        <ColorSelect
          settingsKey="b_msgColor"
          colors={colorSet}
        />
      </Section>     
      
       <Section
        title={<Text bold align="center">Contact Info</Text>}>  
         <Text>Hope you are enjoying Focus-Break!</Text>
         <Text>For any feedback, sugesstions or bug reporting please contact priyanka.ramachander@gmail.com</Text>
    </Section>    
      
    </Page>
  );
}

registerSettingsPage(mySettings);
